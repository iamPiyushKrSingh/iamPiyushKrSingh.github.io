---
title: "Hugo Workshop"
date: 2023-10-13T05:53:17+05:30
draft: false
author: "Me"
showToc: true
UseHugoToc: true
ShowWordCount: true
TocOpen: true
---

## Creating the HUGO site

```bash
hugo new site <username>.github.io --format=yml
```

## Setting up git and gh repo

First change dir to the newly created site dir with `cd <username>.github.io`. Now initialize `git` in the folder.

```bash
git init
```

Now we can add theme to our website as a submodule (yes, submodule as this give us power of clonig this repo with single command)

```bash
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

```

now we have to make sure that HUGO know that we want to use "**PaperMod**" theme.

```bash
echo "theme: \"PaperMod\"" >> hugo.yml
```

To test whether the theme is working or not... run the hugo server

```bash
hugo server -D
```

`-D` flag compiles the draft pages also (helpful when writing actual blogs). If all works correctly then you should be able to see first web page on `localhost:1313`

<!-- ## Creating your GH repo -->
adding these changes and then commiting it.

```bash
git add .
git commit -m '<initial commit>'
```

Now we have to setup the GitHub repo so our web pages are hosted using GitHub pages. So we have to create our repo with the following command,

```bash
gh repo create <username>.github.io --public --push --source=. --remote=origin
```

now we will see meaning of each flag,

- `--public` : this creates a public repo.
- `--push` : push the local commits to the created repo.
- `--source` : and the push specified directory as the source.
- `--remote=origin` : this names the remote as origin.

Since, this pushes the commit as well so essentially your github repo should contain **HUGO** files.
![initial commit](/images/blog/initial-commit.png)

## Customizing your metadata

Since this is our personal blogging site so we should have good landing page with showing who you are with some *social media*. For example, we have a defined page in our theme (see [Fig](https://github.com/adityatelange/hugo-PaperMod/wiki/Features#profile-mode)).

Your current `hugo.yml` file should look like this,

```yaml
baseURL: https://example.org/
languageCode: en-us
title: My New Hugo Site
theme: "PaperMod"
```

Here, we start with `baseURL` change it to `https://<username>.github.io/` and title to whatever you want.

Now, actually at this stage this is your choice what you want to do with your website. But the following setting and options are recommended but you can definitely change them. So in the end it should look like...

```yaml
baseURL: "https://anayRetard.github.io/"
languageCode: en-us
title: The Retard
theme: "PaperMod"
enableEmoji: true
author: "Anay Kuljeet"

mainSections:
  - blog
  - archives

menu:
  main:
    - name: Home
      pageRef: /
      weight: 10
    - name: Blogs
      pageRef: /blog
      weight: 20
    - name: Archives
      url: /archives
      weight: 30

params:
  profileMode:
    enabled: true
    title: "I'm Retarded" # optional default will be site title
    subtitle: "Test Website by Slashdot."
    author: "hehe"
    imageUrl: "/images/profileImg.jpg" # optional
    imageTitle: "Profile Image" # optional
    imageWidth: 400 # custom size
    imageHeight: 300 # custom size
    buttons:
      - name: Blogs
        url: "/blog"

  socialIcons:
    - name: "Linkedin"
      url: "https://slashdot-iiserk.github.io"
    - name: "YouTube"
      url: "https://www.youtube.com/@piyushkrsingh"
    - name: "Github"
      url: "https://github.com/iamPiyushKrSingh"
    - name: "Instagram"
      url: "<>"
```

Now, our main landing page is ready. But put your profile pic in `static/images/profileImg.jpg`.

## Creating sections

Create `/archives` with the following command,

```bash
hugo new archives.md
```

and change metadata of this file as

```metadata
---
title: "Archives"
layout: "archives"
url: "/archives/"
summary: archives
---
```

## Adding first blog

Let's say you are gonna record today's experience. So let's create our first blog,

```bash
hugo new blog/HUGO-workshop-experience.md
```

open the file `content/blog/HUGO-workshop-experience.md`, metadata will look like,

```metadata
+++
title = 'HUGO Workshop Experience'
date = 2023-10-14T02:53:32+05:30
draft = true
+++
```

Then add the content after the data. Now, lets test the blog with,

```bash
hugo server -D
```

After completing blog change as `draft = false`.

## Setup GitHub Actions

First enable read-write perms for workflow action from setting, by going into `Settings -> Action -> General -> Workflow Permissions`.
![workflow permissions](/images/blog/workflow-perms.png)

Let's first create action yml file but command

```bash
mkdir -p .github/workflows && touch $_/hugo.yml
```

After creating this file, add the following thing in the file directly,

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches:
      - main # Set a branch to deploy
  pull_request:
    branches:
      - main

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

# Default to bash
defaults:
  run:
    shell: bash

jobs:
  build-and-deploy-site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: "latest"

      - name: Build site with HUGO
        run: hugo --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

Now, we can push the changes to see the magic of `GitHub Actions`, with

```bash
git add .
git commit -m "first blog"
git push origin main
```

Now chnage the deployment branch to `gh-pages`. In settings of the repo under pages, select the deployment brach as `gh-pages` as
![gh-pages-settings](/images/blog/gh-pages.png)

## Adding New Content

To add content we will add soon.
