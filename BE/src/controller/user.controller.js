const { createError } = require('../constants');
const {errorHandler, asyncHandler} = require('../middlewares/errorHandler');
const {AUTH_ERRORS,
        HTTP_STATUS,
        USER_ERRORS,
        VALIDATION_ERRORS
} = require('../constants');
const { getProfile } = require('../services/user.service');


const UserController = {
    getProfile: asyncHandler(async(req, res) => {
        const {id} = req.params;
        if(!id){
            throw createError(VALIDATION_ERRORS.MISSING_REQUIRED_FIELD, 'Id là bắt buộc')
        }

        const userProfile = await getProfile(id);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data:{
                userProfile
            }
        })
    }),

    updateProfile: async(req, res) =>{

    },

    forgotPassword: async(req, res) =>{

    },

    changePassword: async(req, res) => {

    }
}

module.exports = UserController;