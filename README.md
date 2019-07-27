# gatsby-transformer-ffmpeg

Creates `VideoFFMPEG` nodes from locally hosted video files.

## Install

`npm install --save gatsby-transformer-ffmpeg gatsby-plugin-ffmpeg`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [`gatsby-plugin-ffmpeg`, `gatsby-transformer-ffmpeg`]
};
```

Please note that you must have a source plugin (which brings in images) installed in your project. Otherwise no `VideoFFMPEG` nodes can be created for your files. The recommended example would be [`gatsby-source-filesystem`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-filesystem).

## Parsing algorithm

It recognizes files with the following extensions as images.

- mp4
- avi

Each image file is parsed into a node of type `VideoFFMPEG`.

## Example Query

This query generates both webm and h264 mp4 files for every video file found.

```
{
  allVideoFfmpeg {
    edges {
      node {
        id
        webm: transcode(outputOptions: ["-crf 20", "-b:v 0"], maxWidth: 900, maxHeight: 480, fileExtension: "webm", codec: "libvpx-vp9") {
          width
          src
          presentationMaxWidth
          presentationMaxHeight
          originalName
          height
          aspectRatio
        }
        mp4: transcode(maxWidth: 900, maxHeight: 480, fileExtension: "mp4", codec: "libx264") {
          width
          src
          presentationMaxWidth
          presentationMaxHeight
          originalName
          height
          aspectRatio
        }
      }
    }
  }
}
```
