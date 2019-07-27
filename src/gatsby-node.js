exports.onCreateNode = require(`./on-node-create`)
exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`)

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions

  if (createTypes) {
    createTypes(`
      type VideoFFMPEG implements Node @infer {
        id: ID!
      }
    `)
  }
}
