import axiosStack from '../network/axiosStack';
import { getHeaders } from '../../common/APIUtils';

const URL_PROJECTS = '?route=api/dev/getProjects&includedicontinueprj=false';
const URL_PROJECT_TASKS = '?route=api/dev/getProjectTasks&project_id=';

const getProjects = () => {
    return axiosStack({
        url: URL_PROJECTS,
        method: 'GET',
        headers: getHeaders()
    })
}

const getProjectTasks = (project_id) => {
    let mUrl = URL_PROJECT_TASKS + project_id;
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getHeaders()
    })
}



export const ProjectService = {
    getProjects, getProjectTasks
}