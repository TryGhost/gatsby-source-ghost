# Gatsby Source Ghost

Source plugin for pulling data into Gatsby.js from the [Ghost Public API](https://api.ghost.org).

## Install

`npm install --save gatsby-source-ghost`

## How to use

You need to specify three properties in your `gatsby-config.js`:

```
{
   resolve: `gatsby-source-ghost`,
   options: {
       apiUrl: `https://<your-subdomain>.ghost.io`,
       contentApiKey: `<your content api key>`
   }
}
```

`apiUrl`
 The admin or API URL for your Ghost site. For Ghost(Pro) customers this is your `.ghost.io` domain. For self hosters it is your main domain unless you have a separate `admin` url configured. Note that this URL should be served over HTTPS.

`contentApiKey`
The "Content API Key" copied from the "Integrations" screen in Ghost Admin.


## How to query

There are 4 node types available from Ghost: Post, Page, Author and Tag.

Documentation for the full set of fields made available for each resource type can be found in the [Public API docs](https://api.ghost.org/docs/post).

Posts and Pages have the same properties.

You can query Post nodes created from Ghost like the following:

```
{
  allGhostPost(sort: { order: DESC, fields: [published_at] }) {
    edges {
      node {
        id
        slug
        title
        html
        published_at
        ...
        tags {
          id
          slug
          ...
        }
        primary_tag {
          id
          slug
          ...
        }
        authors {
          id
          slug
          ...
        }
      }
    }
  }
}
```

A common but tricky example of filtering posts by tag, can be achieved like this (Gatsby v2+):

```
{
  allGhostPost(filter: {tags: {elemMatch: {slug: {eq: $slug}}}}) {
    edges {
      node {
        slug
        ...
      }
    }
  }
}
```

You can query Page nodes created from Ghost like the following:

```
{
  allGhostPage {
    edges {
      node {
        id
        slug
        title
        html
        ...
      }
    }
  }
}
```

You can query Tag nodes created from Ghost like the following:

```
{
  allGhostTag {
    edges {
      node {
        id
        slug
        name
        ...
      }
    }
  }
}
```

You can query Author nodes created from Ghost like the following:

```
{
  allGhostAuthor {
    edges {
      node {
        id
        slug
        name
        ...
      }
    }
  }
}
```



# Copyright & License

Copyright (c) 2018-2019 Ghost Foundation - Released under the [MIT license](LICENSE).
