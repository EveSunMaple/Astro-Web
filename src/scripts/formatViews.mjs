function formatViews(views) {
    if (views < 10000) {
        return views.toString();
    }
    else if (views < 1000000) {
        return Math.floor(views / 1000) + 'K';
    }
    else {
        return (views / 1000000).toFixed(1) + 'M';
    }
}