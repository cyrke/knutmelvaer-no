import React, {useEffect} from 'react'
import {graphql} from 'gatsby'
import {useScrollPercentage} from 'react-scroll-percentage'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'
import BlogPost from '../components/blog-post'
import SEO from '../components/seo'
import Layout from '../containers/layout'
import {toPlainText} from '../lib/helpers'

export const query = graphql`
  query BlogPostTemplateQuery($id: String!, $permalink: String!) {
    post: sanityPost(id: {eq: $id}) {
      id
      readingTimeInMinutes
      publishedAt
      _updatedAt
      categories {
        _id
        title
        slug {
          current
        }
      }
      mainImage {
        ...SanityImage
        alt
        caption
      }
      title
      slug {
        current
      }
      _rawExcerpt
      _rawBody(resolveReferences: {maxDepth: 5})
      tweet
      authors {
        _key
        author: person {
          _rawBio
          _id
          image {
            crop {
              _key
              _type
              top
              bottom
              left
              right
            }
            hotspot {
              _key
              _type
              x
              y
              height
              width
            }
            asset {
              _id
            }
          }
          name
        }
      }
    }
    allWebMentionEntry(filter: {wmTarget: {eq: $permalink}}) {
    edges {
      node {
        type
        mentionOf
        name
        wmTarget
        wmSource
        wmProperty
        wmPrivate
        wmId
        url
        author {
          name
          type
          photo
          url
        }
      }
    }
  }
  }
`

const BlogPostTemplate = props => {
  const [ref, percentage] = useScrollPercentage({
    /* Optional options */
    threshold: 0,
  })
  const {data, errors} = props
  const post = data && data.post
  const allWebMentionEntry = data && data.allWebMentionEntry
  useEffect(() => {
    if (post) {
      const percent = Math.round(percentage * 100)
      document.title = `${percent}% ${post.title}`
    }
  }, [percentage])
  return (
    <Layout>
      {errors && <SEO title='GraphQL Error' />}
      {post && <SEO title={` ${post.title}` || 'Untitled'} description={toPlainText(post._rawExcerpt || [])} />}

      {errors && (
        <Container>
          <GraphQLErrorList errors={errors} />
        </Container>
      )}<div ref={ref}>
      {post && <BlogPost {...post} wm={allWebMentionEntry} />}
      </div>
    </Layout>
  )
}

export default BlogPostTemplate
