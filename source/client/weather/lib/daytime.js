const dayTime = (time) => {
    let hour = new Date(time).getHours();

    if (hour >= 4 && hour < 10) {
        return 'Morning';
    }

    if (hour >= 10 && hour < 16) {
        return 'Noon';
    }

    if (hour >= 16 && hour < 22) {
        return 'Evening';
    }

    return 'Night';
};

export default dayTime;
