export const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Investment research backend is running',
    timestamp: new Date().toISOString()
  });
};