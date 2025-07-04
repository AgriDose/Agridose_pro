const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// 1. حماية الروابط - يجب أن يكون المستخدم مسجلاً دخوله
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // الحصول على التوكن من Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // أو من الكوكيز (للواجهة الأمامية)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // التأكد من وجود توكن
  if (!token) {
    return next(new ErrorResponse('غير مصرح بالدخول', 401));
  }

  try {
    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // إضافة بيانات المستخدم إلى Request
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('غير مصرح بالدخول', 401));
  }
});

// 2. الصلاحيات (للمشرفين فقط)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`المستخدم ذو الدور ${req.user.role} غير مصرح له بهذا الإجراء`, 403)
      );
    }
    next();
  };
};
