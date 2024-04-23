import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
const token = process.env.SANITY_TOKEN;

export const clientCDN = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
  ignoreBrowserTokenWarning: true,
});

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: string) => builder.image(source);
