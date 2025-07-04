const errorHandler = (err, req, res, next) => {
  // تسجيل الخطأ للأغراض التنقيحية
  console.error(`[${new Date().toISOString()}]`, err);

  // حالة الخطأ المخصصة
  const status = err.statusCode || 500;
  const message = status === 500 ? 'خطأ في الخادم الداخلي' : err.message;

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
