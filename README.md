# gatsby-transformer-ffmpeg

Creates `VideoFFMPEG` nodes from locally hosted video files.

## Install

`npm install --save gatsby-transformer-ffmpeg gatsby-plugin-ffmpeg`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [`gatsby-transformer-ffmpeg`],
}
```

Please note that you must have a source plugin (which brings in images) installed in your project. Otherwise no `VideoFFMPEG` nodes can be created for your files. The recommended example would be [`gatsby-source-filesystem`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-filesystem).

## Parsing algorithm

Currently it only detects files with the extensions `avi`, `mp4`, `mov`, `mkv`. If you have a different container and would like it added, open an issue or create a PR and I'm happy to include it.

Each image file is parsed into a node of type `VideoFFMPEG`.

## Example Query

This query generates both webm and h264 mp4 files for every video file found.

```
{
  allVideoFfmpeg {
    edges {
      node {
        webm: transcode(codec: "libvpx-vp9", maxWidth: 900, maxHeight: 480, fileExtension: "webm", outputOptions: ["-crf 20", "-b:v 0"]) {
          width
          src
          presentationMaxWidth
          presentationMaxHeight
          originalName
          height
          aspectRatio
        }
        mp4: transcode(codec: "libx264", maxWidth: 900, maxHeight: 480, fileExtension: "mp4", options:[["-profile:v", "main"], ["-pix_fmt", "yuv420p"]], outputOptions: ["-movflags faststart"]) {
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

## Specific files

In your gatsby-config, have a filesystem source plugin that loads a certain folder for example.

```

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/packages/resources`,
        name: 'resources',
        ignore: [`**/\.*`],
      },
    },
```

With a video file in `packages/resources/videofile.mp4` we will be able to grab the following:

```
{
  file(relativePath: {eq: "videofile.mp4"}) {
    childVideoFfmpeg {
      mp4: transcode(maxWidth: 900, maxHeight: 480, fileExtension: "mp4", codec: "libx264", options:[["-profile:v", "main"], ["-pix_fmt", "yuv420p"]], outputOptions: ["-movflags faststart"]) {
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
```

## Funding

<p align="center">
<a href="https://electricui.com/">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://electricui.com/web_static/monochrome-logotype.svg">
  <img alt="Electric UI" src="https://electricui.com/web_static/logotype.svg" width="500">
</picture>
</a>
</p>

---

Work on `gatsby-plugin-ffmpeg` is funded by [Electric UI](https://electricui.com). If you need to design an [Arduino GUI](https://electricui.com/hello/arduino), want [visualisations for a complex robotics system](https://electricui.com/features) or generally need a [user interface for your hardware project](https://electricui.com/features), please take a look at the website.
