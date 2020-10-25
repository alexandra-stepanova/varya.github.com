const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

const REPO_URL = "https://github.com/varya/varya.github.com";
const REPO_BRANCH = "develop";
``;

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "Mdx") {
    const fileNode = getNode(node.parent);
    let slug = createFilePath({ node, getNode, basePath: `pages` });

    const separtorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0;

    // only for posts
    if (
      fileNode.sourceInstanceName === "posts" ||
      fileNode.sourceInstanceName === "life"
    ) {
      //const folder = node.frontmatter.old ? 'issues' : fileNode.sourceInstanceName;
      const folder = fileNode.sourceInstanceName;

      if (node.frontmatter.v2 || node.frontmatter.old) {
        let paths = fileNode.relativePath.split("index_en.md");
        if (paths[1] === "") {
          slug = `en/${folder}/${paths[0]}`;
        }
        paths = fileNode.relativePath.split("index_ru.md");
        if (paths[1] === "") {
          slug = `ru/${folder}/${paths[0]}`;
        }
      } else {
        slug = `blog${slug}`;
      }
    }

    const newSlug = `${separtorIndex ? "/" : ""}${slug.substring(
      shortSlugStart
    )}`;
    createNodeField({
      node,
      name: `slug`,
      value: newSlug,
    });

    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : "",
    });

    // detect Node language
    let lang = "en";
    if (fileNode.base.endsWith("_ru.md")) {
      lang = "ru";
    }
    createNodeField({
      node,
      name: `lang`,
      value: lang,
    });

    let disqusIdentifier = slug.split("/").filter((item) => item != "");
    if (node.frontmatter.v2) {
      if (disqusIdentifier[0] === "en" || disqusIdentifier[0] === "ru") {
        disqusIdentifier.shift();
      }
      disqusIdentifier.push("index");
      disqusIdentifier.push(lang);
    }
    if (node.frontmatter.old) {
      disqusIdentifier = disqusIdentifier.map((item) =>
        item === "posts" ? "issues" : item
      );
    }
    disqusIdentifier = disqusIdentifier.join("-");

    createNodeField({
      node,
      name: `disqusIdentifier`,
      value: disqusIdentifier,
    });

    createNodeField({
      node,
      name: "fileRelativePath",
      value: fileNode.relativePath,
    });

    const level = (fileNode.relativePath.match(/\//g) || []).length;
    createNodeField({
      node,
      name: `level`,
      value: level,
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMdx(
        filter: { fileAbsolutePath: { regex: "//posts|pages|life//" } }
        sort: {
          fields: [fields___prefix, frontmatter___date]
          order: [DESC, DESC]
        }
      ) {
        edges {
          node {
            id
            fileAbsolutePath
            fields {
              slug
              prefix
              lang
              disqusIdentifier
              level
              fileRelativePath
            }
            frontmatter {
              title
              subTitle
              v2
              old
              date
              layout
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
  }

  // Create blog post pages.
  const items = result.data.allMdx.edges;

  const posts = items.filter((item) =>
    /posts/.test(item.node.fileAbsolutePath)
  );
  posts.forEach(({ node }, index) => {
    const slug = node.fields && node.fields.slug;
    const next = index === 0 ? undefined : posts[index - 1].node;
    const prev = index === posts.length - 1 ? undefined : posts[index + 1].node;
    const fileSourceUrl = `${REPO_URL}/edit/${REPO_BRANCH}/content/posts/${node.fields.fileRelativePath}`;

    createPage({
      path: slug,
      component: path.resolve(`./src/components/Page/Page--post.js`),
      context: {
        slug,
        prev,
        next,
        fileSourceUrl,
      },
    });
  });

  // Create paginated blog index pages
  // consider only english posts, russian ones are not displayed at /blog page
  const postsEng = posts.filter((post) => post.node.fields.lang === "en");
  const postsPerPage = 10;
  const numPages = Math.ceil(postsEng.length / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve("./src/components/Page/Page--blog.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
        pathPrefix: "/blog/",
      },
    });
  });

  // Create life  posts
  const lifePosts = items.filter((item) =>
    /life/.test(item.node.fileAbsolutePath)
  );
  lifePosts.forEach(({ node }, index) => {
    const slug = node.fields.slug;
    const next = index === 0 ? undefined : lifePosts[index - 1].node;
    const prev =
      index === lifePosts.length - 1 ? undefined : lifePosts[index + 1].node;

    const fileSourceUrl = `${REPO_URL}/edit/${REPO_BRANCH}/content/life/${node.fields.fileRelativePath}`;

    createPage({
      path: slug,
      component: path.resolve(`./src/components/Page/Page--post.js`),
      context: {
        slug,
        prev,
        next,
        fileSourceUrl,
      },
    });
  });

  const pages = items.filter((item) =>
    /pages/.test(item.node.fileAbsolutePath)
  );

  // you'll call `createPage` for each result
  pages.forEach(({ node }) => {
    const slug = node.fields.slug;

    let breadCrumbs = [];
    /* making bread crumbs */
    if (node.fields.level > 1) {
      const slugItems = node.fields.slug
        .split("/")
        .filter((item) => item !== "");
      slugItems.reduce((acc, val) => {
        /* find parent page */
        const p = pages.find((item) => item.node.fields.slug === acc) || {
          node: {
            fields: {
              slug: "/",
            },
            frontmatter: {
              title: "Home",
            },
          },
        };
        breadCrumbs.push(p);
        return acc + val + "/";
      }, "/");
      breadCrumbs.push({ node, last: true });
    }

    const fileSourceUrl = `${REPO_URL}/edit/${REPO_BRANCH}/content/pages/${node.fields.fileRelativePath}`;

    createPage({
      // This is the slug you created before
      // (or `node.frontmatter.slug`)
      path: node.fields.slug,
      // This component will wrap our MDX content
      component: path.resolve(
        node.frontmatter.layout || `./src/components/Page/Page--page.js`
      ),
      // You can use the values in this context in
      // our page layout component
      context: {
        id: node.id,
        slug,
        breadCrumbs,
        fileSourceUrl,
      },
    });
  });
};
