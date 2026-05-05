export const cleanSiteForStorage = (site: any) => {
    const copy = structuredClone(site);

    const data = copy?.data ?? copy;

    const pages = Array.isArray(data?.pages) ? data.pages : [];

    return {
        ...copy,
        data: {
            ...data,
            pages: pages.map((page: any) => ({
                ...page,
                sections: Array.isArray(page?.sections)
                    ? page.sections
                    : [],
            })),
        },
    };
};