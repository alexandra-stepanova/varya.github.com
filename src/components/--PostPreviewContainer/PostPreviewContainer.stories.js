import React from "react";
import PostPreviewContainer from "./PostPreviewContainer.js";
import PostPreview from "../--PostPreview";
import Paragraph from "../--Paragraph";
import { Box, Heading, Button } from "grommet";

export default {
  title: "Composed/PostPreviewContainer",
  component: PostPreviewContainer,
};

export const Default = (args) => (
  <Box>
    <Heading level="2" color="brand" alignText="center">
      Default grid: one full-width item in a row
    </Heading>
    <PostPreviewContainer>
      <PostPreview {...args} />
      <PostPreview {...args} />
    </PostPreviewContainer>

    <Heading level="2" color="brand" justify="center">
      Two items in a row
    </Heading>
    <PostPreviewContainer items={2}>
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
    </PostPreviewContainer>

    <Heading level="2" color="brand" justify="center">
      3 items in a row
    </Heading>
    <PostPreviewContainer items={3}>
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
    </PostPreviewContainer>

    <Heading level="2" color="brand" justify="center">
      4 items in a row
    </Heading>
    <PostPreviewContainer items={4}>
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
    </PostPreviewContainer>
  </Box>
);

Default.args = {
  slug: "/postname",
  cover: "https://source.unsplash.com/random",
  title: "Using the concept of business models for innovation",
  excerpt:
    "The examples of great business models are rarely static but most often those that demonstrate changes responding to the market and competition challenges. As we cannot foresee the future, it is not possible to design a static business model once and forever. Thus, to achieve and keep their business success, companies need ongoing innovative activity.",
  date: "17 August 2020",
  readingTime: "3 min read",
};

export const Responsive = (args) => (
  <Box>
    <Heading level="2" color="brand" justify="center">
      Responsive number of items
    </Heading>
    <PostPreviewContainer items={{ small: 1, medium: 2, large: 3 }}>
      <PostPreview {...args} />
      <PostPreview {...args} />
      <PostPreview {...args} />
    </PostPreviewContainer>
  </Box>
);

Responsive.args = {
  slug: "/postname",
  cover: "https://source.unsplash.com/random",
  title: "Using the concept of business models for innovation",
  excerpt:
    "The examples of great business models are rarely static but most often those that demonstrate changes responding to the market and competition challenges. As we cannot foresee the future, it is not possible to design a static business model once and forever. Thus, to achieve and keep their business success, companies need ongoing innovative activity.",
  date: "17 August 2020",
  readingTime: "3 min read",
};

export const Colored = (args) => (
  <Box>
    <Heading level="2" color="brand" justify="center">
      Colored
    </Heading>
    <Heading level="4">Using title and excerpt props:</Heading>
    <PostPreviewContainer items={{ small: 1, medium: 2, large: 3 }}>
      <PostPreview {...args} background="brand" align="center" />
      <PostPreview {...args} background="accent" justify="center" />
      <PostPreview {...args} background="neutral" />
    </PostPreviewContainer>

    <Heading level="4">Using nested children:</Heading>
    <PostPreviewContainer items={{ small: 1, medium: 2, large: 3 }}>
      <PostPreview slug="/test" background="brand" align="center">
        <Heading level="3" size="large">
          Consultancy
        </Heading>
        <Paragraph size="large">
          Read more about consultancy services I provide
        </Paragraph>
      </PostPreview>
      <PostPreview slug="/test" background="accent-3" align="center">
        <Heading
          level="3"
          size="large"
          margin={{ vertical: "small" }}
          color="brand"
        >
          Consultancy
        </Heading>
        <Paragraph standout>
          Find more about how I can help you develop design system for your next
          project.
        </Paragraph>
      </PostPreview>
      <PostPreview slug="/test" background="neutral" justify="center">
        <Heading level="3" size="large" margin={{ vertical: "small" }}>
          Consultancy
        </Heading>
        <Paragraph>
          Find more about how I can help you develop design system for your next
          project.
        </Paragraph>
        <Button size="large" primary label="Read more" />
      </PostPreview>
    </PostPreviewContainer>
  </Box>
);

Colored.args = {
  slug: "/postname",
  cover: undefined,
  title: "Consultancy",
  excerpt:
    "Find more about how I can help you develop design system for your project.",
  date: undefined,
  readingTime: undefined,
};
