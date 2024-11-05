module.exports.formatErrValidate = (errValidate) => {
   return errValidate.map((value) => {
      return {
         field: value.path,
         message: value.msg,
      };
   });
};
