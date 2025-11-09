import api_aw from "../api/api_aw";

export const getImagesFromCloudinaryFolder = async (folderName, setState) => {
    try {
        api_aw.get(`/images/${folderName}/all`).then((response) => {
            if (response.status === 200) {
                setState(response.data.data);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
