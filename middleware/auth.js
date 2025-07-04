const asyncHandler = require('./asyncHandler');

// Middleware المصادقة الأساسية
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'مطلوب مصادقة للوصول إلى هذا المورد'
    });
  }
  
  // هنا يمكنك إضافة منطق التحقق من JWT أو أي نظام مصادقة آخر
  // مثال:
  // const decoded = verifyToken(token);
  // req.user = await User.findById(decoded.id);
  
  next();
});

// Middleware الصلاحيات (اختياري)
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      error: 'ليس لديك صلاحية للقيام بهذا الإجراء'
    });
  }
  next();
};

module.exports = { protect, authorize };
