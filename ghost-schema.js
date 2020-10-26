/**
 * Custom schema with types based on the Ghost V3 API spec.
 *
 * Note that GhostPost and GhostPage are identical.
 *
 * Foreign Keys are linked by 'slug'.
 *
 * `GhostNavigation` and `GhostPostCount` are custom types which do not become nodes.
 * They instead represent the shape of objects returned by the Ghost API for navigation and post count.
 */

const types = `
type GhostPost implements Node {
    slug: String!
    id: ID!
    uuid: String!
    title: String!
    html: String
    comment_id: String
    feature_image: String
    featured: Boolean!
    visibility: String!
    created_at: Date! @dateformat
    updated_at: Date @dateformat
    published_at: Date @dateformat
    custom_excerpt: String
    codeinjection_head: String
    codeinjection_foot: String
    codeinjection_styles: String
    custom_template: String
    canonical_url: String
    send_email_when_published: Boolean
    tags: [GhostTag] @link(from: "tags.slug" by: "slug")
    authors: [GhostAuthor]! @link(from: "authors.slug" by: "slug")
    primary_author: GhostAuthor! @link(from: "primary_author.slug" by: "slug")
    primary_tag: GhostTag @link(from: "primary_tag.slug" by: "slug")
    url: String!
    excerpt: String
    reading_time: Int
    email_subject: String
    plaintext: String
    page: Boolean
    og_image: String
    og_title: String
    og_description: String
    twitter_image: String
    twitter_title: String
    twitter_description: String
    meta_title: String
    meta_description: String
    email_subject: String
}

type GhostPage implements Node {
    slug: String!
    id: ID!
    uuid: String!
    title: String!
    html: String
    comment_id: String
    feature_image: String
    featured: Boolean!
    visibility: String!
    created_at: Date! @dateformat
    updated_at: Date @dateformat
    published_at: Date @dateformat
    custom_excerpt: String
    codeinjection_head: String
    codeinjection_foot: String
    codeinjection_styles: String
    custom_template: String
    canonical_url: String
    send_email_when_published: Boolean
    tags: [GhostTag] @link(from: "tags.slug" by: "slug")
    authors: [GhostAuthor]! @link(from: "authors.slug" by: "slug")
    primary_author: GhostAuthor! @link(from: "primary_author.slug" by: "slug")
    primary_tag: GhostTag @link(from: "primary_tag.slug" by: "slug")
    url: String!
    excerpt: String
    reading_time: Int
    email_subject: String
    plaintext: String
    page: Boolean
    og_image: String
    og_title: String
    og_description: String
    twitter_image: String
    twitter_title: String
    twitter_description: String
    meta_title: String
    meta_description: String
    email_subject: String
}

type GhostTag implements Node {
    slug: String!
    id: ID!
    name: String!
    description: String
    feature_image: String
    visibility: String!
    meta_title: String
    meta_description: String
    url: String!
    count: GhostPostCount
    postCount: Int
    og_image: String
    og_title: String
    og_description: String
    twitter_image: String
    twitter_title: String
    twitter_description: String
    codeinjection_head: String
    codeinjection_foot: String
    canonical_url: String
    accent_color: String
}

type GhostAuthor implements Node {
    slug: String!
    id: ID!
    name: String!
    profile_image: String
    cover_image: String
    bio: String
    website: String
    location: String
    facebook: String
    twitter: String
    meta_title: String
    meta_description: String
    url: String!
    count: GhostPostCount!
    postCount: Int!
}

type GhostSettings implements Node {
    title: String
    description: String
    logo: String
    icon: String
    cover_image: String
    facebook: String
    twitter: String
    lang: String!
    timezone: String!
    navigation: [GhostNavigation]
    secondary_navigation: [GhostNavigation]
    meta_title: String
    meta_description: String
    og_image: String
    og_title: String
    og_description: String
    twitter_image: String
    twitter_title: String
    twitter_description: String
    url: String!
    codeinjection_head: String
    codeinjection_foot: String
    codeinjection_styles: String!
    active_timezone: String
    default_locale: String
}

type GhostNavigation {
    label: String!
    url: String!
}

type GhostPostCount {
    posts: Int
}
`;

module.exports = types;
