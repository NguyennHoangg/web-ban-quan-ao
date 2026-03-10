const { createError } = require('../constants');
const {errorHandler, asyncHandler} = require('../middlewares/errorHandler');
const {AUTH_ERRORS,
        HTTP_STATUS,
        USER_ERRORS,
        VALIDATION_ERRORS
} = require('../constants');
const { getProfile, updateProfile } = require('../services/user.service');


const UserController = {
    getProfile: asyncHandler(async(req, res) => {
        const {id} = req.params;
        if(!id){
            throw createError(VALIDATION_ERRORS.MISSING_REQUIRED_FIELD, 'Id là bắt buộc')
        }

        const user = await getProfile(id);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: {user}
        })
    }),

    updateProfile: asyncHandler(async(req, res) =>{
        const {id, full_name, date_of_birth, gender, email, phone } = req.body;
        if(!id){
            throw createError(VALIDATION_ERRORS.MISSING_REQUIRED_FIELD, 'Id là bắt buộc');
        }

        // Truyền object vào service - tối ưu khi có nhiều tham số
        const user = await updateProfile({
            id,
            full_name,
            date_of_birth,
            gender,
            email,
            phone
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: { user }
        });
    }),

    forgotPassword: async(req, res) =>{

    },

    changePassword: async(req, res) => {

    }
}

module.exports = UserController;