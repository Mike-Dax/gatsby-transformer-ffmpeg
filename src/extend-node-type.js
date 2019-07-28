const Promise = require(`bluebird`)
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = require(`gatsby/graphql`)

const { transcode } = require(`gatsby-plugin-ffmpeg`)

const transcodeNode = ({
  type,
  pathPrefix,
  getNodeAndSavePathDependency,
  reporter,
  name,
  cache,
}) => {
  return {
    type: new GraphQLObjectType({
      name: name,
      fields: {
        aspectRatio: { type: GraphQLFloat },
        width: { type: GraphQLFloat },
        height: { type: GraphQLFloat },

        presentationMaxWidth: { type: GraphQLFloat },
        presentationMaxHeight: { type: GraphQLFloat },

        src: { type: GraphQLString },
        originalName: { type: GraphQLString },
        fileExtension: { type: GraphQLString },
      },
    }),
    args: {
      codec: {
        type: GraphQLString,
        defaultValue: 'libx264',
      },
      maxWidth: {
        type: GraphQLInt,
        defaultValue: 900,
      },
      maxHeight: {
        type: GraphQLInt,
        defaultValue: 480,
      },
      audio: {
        type: GraphQLBoolean,
        defaultValue: false,
      },
      outputOptions: {
        type: new GraphQLList(GraphQLString),
        defaultValue: [],
      },
      fileExtension: {
        type: new GraphQLNonNull(GraphQLString),
        defaultValue: 'mp4',
      },
    },
    resolve: (video, fieldArgs, context) => {
      const file = getNodeAndSavePathDependency(video.parent, context.path)
      const args = { ...fieldArgs, pathPrefix }
      const {
        codec,
        maxWidth,
        maxHeight,
        audio,
        outputOptions,
        fileExtension,
      } = fieldArgs

      /// turn args into transcodeOptions

      const pipeline = {
        name: 'graphql-pipeline',
        transcode: chain => {
          let mutableChain = chain.videoCodec(codec)

          if (!audio) {
            mutableChain = mutableChain.noAudio()
          }

          mutableChain = mutableChain.outputOptions(outputOptions)

          return mutableChain
        },
        maxHeight,
        maxWidth,
        fileExtension,
      }

      const transcodeOptions = {
        pipelines: [pipeline],
      }

      return Promise.resolve(
        transcode({
          file,
          options: transcodeOptions,
          reporter,
          //  cache,
        })
      ).then(o =>
        Object.assign({}, o, {
          fieldArgs: args,
          video,
          file,
          src: o.videos[0].src,
          fileExtension,
        })
      )
    },
  }
}

module.exports = ({
  type,
  pathPrefix,
  getNodeAndSavePathDependency,
  reporter,
  cache,
}) => {
  if (type.name !== `VideoFFMPEG`) {
    return {}
  }

  const nodeOptions = {
    type,
    pathPrefix,
    getNodeAndSavePathDependency,
    reporter,
    cache,
  }

  // TODO: Remove resolutionsNode and sizesNode for Gatsby v3
  const tcNode = transcodeNode({
    name: `VideoFFMPEGTranscoded`,
    ...nodeOptions,
  })

  return {
    transcode: tcNode,
  }
}
