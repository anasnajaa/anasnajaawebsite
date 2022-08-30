/* eslint-disable no-undef */
require("dotenv").config();
const fetch = require('isomorphic-fetch');
const environment = process.env.NODE_ENV;
const stage = require("../config/index")[environment];
const API_KEY = stage.blog.apiKey;
const API_URL = stage.blog.apiUrl;
const KEY = `key=${API_KEY}`;

exports.getPosts = async (limit, page, tag) => {
  const response = await fetch(
    `${API_URL}/posts/?${KEY}&` +
    `fields=id,title,slug,custom_excerpt,reading_time,feature_image,` +
    `created_at,updated_at,published_at,meta&include=tags&limit=${limit}&page=${page}&` +
    `${tag ? `filter=tag:${tag}` : ""}`
  );
  if (response.ok) return await response.json();
  return null;
};

exports.getAllPosts = async () => {
  const response = await fetch(
    `${API_URL}/posts/?${KEY}&fields=id,title,slug,published_at,tags.id&limit=all`
  );
  if (response.ok) return await response.json();
  return null;
};

exports.getPostBySlug = async (slug) => {
  const response = await fetch(
    `${API_URL}/posts/slug/${slug}/?${KEY}&include=tags&` +
    "fields=id,title,slug,html,reading_time,feature_image,created_at,updated_at,published_at"
  );
  if (response.ok) {
    const body = await response.json();
    return body.posts[0];
  }
  return null;
};

exports.getBlogSettings = async () => {
  const response = await fetch(`${API_URL}/settings/?${KEY}`);
  if (response.ok) return await response.json();
  return null;
};

exports.getTags = async () => {
  const response = await fetch(
    `${API_URL}/tags/?${KEY}&&include=count.posts&limit=all&filter=visibility:public`
  );
  if (response.ok) return await response.json();
  return null;
};

exports.getPagesByInternalTag = async (internalTag) => {
  const response = await fetch(
    `${API_URL}/pages/?${KEY}&fields=id,title,html,feature_image,` +
    `updated_at,published_at&limit=all&filter=tag:${internalTag}&filter=visibility:internal`
  );
  if (response.ok) return await response.json();
  return null;
};

exports.getPageBySlug = async (slug) => {
  const response = await fetch(
    `${API_URL}/pages/slug/${slug}/?${KEY}&fields=id,title,html,feature_image,created_at,updated_at,published_at`
  );
  if (response.ok) {
    const body = await response.json();
    return body.pages[0];
  }
  return null;
};

exports.tagsCssResolver = (id) => {
  switch (id) {
    case "5f86bc611488fc001eea51ae": return "blog-red-tag";
    case "6304b0e122678c34a8480607": return "blog-blue-tag";
    case "6304b0e122678c34a8480609": return "blog-green-tag";
    case "6304b0e122678c34a848060a": return "blog-purple-tag";
    default: return "";
  }
};
