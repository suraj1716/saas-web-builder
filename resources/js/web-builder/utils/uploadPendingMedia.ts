import axios from "axios";

export const uploadPendingMedia = async (site: any) => {
    const newSite = structuredClone(site);

    for (const page of newSite.pages) {
        for (const section of page.sections) {
            const content = section.content;

            if (content?.temp_file && content?.needs_upload) {
                const formData = new FormData();
                formData.append("file", content.temp_file);

                const res = await axios.post("/media/upload", formData);

                content.image_id = res.data.id;
                content.image_url = res.data.url;

                delete content.temp_file;
                delete content.needs_upload;
            }
        }
    }

    return newSite;
};