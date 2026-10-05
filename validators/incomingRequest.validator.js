const validateIncomingRequest = (req, res, next) => {
    const { title, description, completed } = req.body;

    let msg = '';

    if (typeof title !== 'string' || title.trim() === '') {
        msg = 'title is missing or title has invalid data';
    } else if (
        typeof description !== 'string' ||
        description.trim() === ''
    ) {
        msg = 'description is missing or description has invalid data';
    } else if (typeof completed !== 'boolean') {
        msg = 'completed is missing or completed has invalid data';
    }

    if (msg) {
        return res.status(400).json({
            message: msg
        });
    }

    next();
};

module.exports = validateIncomingRequest;