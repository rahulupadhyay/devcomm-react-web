import { getAuthHeaders, URL_ALBUM_COLLOBORATOR, URL_EOM_COLLOBORATOR } from '../../common/APIUtils';
import axiosStack from '../network/axiosStack';

/**
 * To check user's access to the EOM collaboration 
 */
const isEOMCollaborator = () => {
    return axiosStack({
        url: URL_EOM_COLLOBORATOR,
        method: "GET",
        headers: getAuthHeaders()
    });
}


/**
 * To check user's access to the ALBUM collaboration 
 */
const isAlbumCollaborator = () => {
    return axiosStack({
        url: URL_ALBUM_COLLOBORATOR,
        method: "GET",
        headers: getAuthHeaders()
    });
}

export const CollaboratorService = {
    isEOMCollaborator, isAlbumCollaborator
}