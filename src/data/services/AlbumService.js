import { stringify } from "qs";

import { getAuthHeaders, URL_ADD_ALBUM, URL_DELETE_ALBUM, URL_GET_ALBUM, URL_GET_ALBUMS, URL_UPDATE_ALBUM } from '../../common/APIUtils';
import axiosStack from '../network/axiosStack';

const getAlbums = () => {
    return axiosStack({
        url: URL_GET_ALBUMS,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

const getAlbum = (albumId) => {
    let mUrl = URL_GET_ALBUM + albumId;
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

const getAlbumsByYear = (year) => {
    let mUrl = URL_GET_ALBUM + year;
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

const addAlbum = (album) => {
    return axiosStack({
        url: URL_ADD_ALBUM,
        method: 'POST',
        data: stringify(album),
        headers: getAuthHeaders()
    })
}

const updateAlbum = (album) => {
    return axiosStack({
        url: URL_UPDATE_ALBUM,
        method: 'POST',
        data: stringify(album),
        headers: getAuthHeaders()
    })
}

const deleteAlbum = (albumId) => {
    const album = {
        album_id: albumId
    }
    return axiosStack({
        url: URL_DELETE_ALBUM,
        method: 'POST',
        data: stringify(album),
        headers: getAuthHeaders()
    })
}



export const AlbumService = {
    addAlbum, updateAlbum, deleteAlbum, getAlbum, getAlbums, getAlbumsByYear
}