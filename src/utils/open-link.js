const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};

export const onClickUrl = (url) => {
    return () => openInNewTab(encodeURI(url));
};
