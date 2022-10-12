const computeFlexPoints = (req, res) => {
    const flexPoints = (req.query.monthlyRate/21.75)*req.query.flexCredits;

    res.json({flexPoints});
}

module.exports = { computeFlexPoints };