const supportedExtensions = {
  mp4: true,
  avi: true,
  mov: true,
  mkv: true,
}

module.exports = async function onCreateNode({ node, actions, createNodeId }) {
  const { createNode, createParentChildLink } = actions

  if (!supportedExtensions[node.extension]) {
    return
  }

  const videoNode = {
    id: createNodeId(`${node.id} >> VideoFFMPEG`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: `${node.internal.contentDigest}`,
      type: `VideoFFMPEG`,
    },
  }

  createNode(videoNode)
  createParentChildLink({ parent: node, child: videoNode })

  return
}
