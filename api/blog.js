const API_KEY   = "9c8569eb29d07e9f4b3819310d"; //for public content only
const API_URL   = "https://hecked-blog.herokuapp.com/ghost/api/v3/content";
const KEY       = `key=${API_KEY}`
const ERRMSG    = `Data retrival failed for endpoint:`;

export const getPosts = async (limit, page, topic) => {
    const response = await fetch(`${API_URL}/posts/?${KEY}&` +
    `fields=id,title,slug,custom_excerpt,reading_time,feature_image,`+
    `created_at,updated_at,published_at,meta&include=tags&limit=${limit}&page=${page}&`+
    `${topic ? `filter=tag:${topic}`:""}`);
    if(response.ok){
        return await response.json();
    } else {
        throw Error(`${ERRMSG} getPosts`);
    }
}

export const getArchivePosts = async () => {
    const response = await fetch(`${API_URL}/posts/?${KEY}&` +
    `fields=id,title,slug,published_at,tags.id&limit=all`);
    if(response.ok){
        return await response.json();
    } else {
        throw Error(`${ERRMSG} getArchivePosts`);
    }
}

export const getPostBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/posts/slug/${slug}/?${KEY}&include=tags&` +
    "fields=id,title,slug,html,reading_time,feature_image,created_at,updated_at,published_at");
    if(response.ok){
        const body = await response.json();
        return body.posts[0];
    } else {
        throw Error(`${ERRMSG} getPostBySlug`);
    }
}

export const getSettings = async () => {
    const response = await fetch(`${API_URL}/settings/?${KEY}`);
    if(response.ok){
        return await response.json();
    } else {
        throw Error(`${ERRMSG} getSettings`);
    }
}

export const getTags = async () => {
    const response = await fetch(`${API_URL}/tags/?${KEY}&` +
    `&include=count.posts&limit=all&filter=visibility:public`);
    if(response.ok){
        return await response.json();
    } else {
        throw Error(`${ERRMSG} getTags`);
    }
}

export const getPagesByInternalTag = async (internalTag) => {
    const response = await fetch(`${API_URL}/pages/?${KEY}&` +
    `fields=id,title,html,feature_image,`+
    `updated_at,published_at&limit=all&filter=tag:${internalTag}&filter=visibility:internal`);
    if(response.ok){
        return await response.json();
    } else {
        throw Error(`${ERRMSG} getPageData`);
    }
}

export const getPageBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/pages/slug/${slug}/?${KEY}&` +
    "fields=id,title,html,feature_image,created_at,updated_at,published_at");
    if(response.ok){
        const body = await response.json();
        return body.pages[0];
    } else {
        throw Error(`${ERRMSG} getPageBySlug`);
    }
}