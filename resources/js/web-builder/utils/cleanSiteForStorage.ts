export const cleanSiteForStorage = (site: any) => {
    const copy = structuredClone(site);

    for (const page of copy.pages) {
        for (const section of page.sections) {
            if (section.content?.temp_file) {
                delete section.content.temp_file;
            }
        }
    }

    return copy;
};