import * as yup from "yup";

export const locationSchema = yup.object().shape({
    name: yup.string().required(),
    location: yup.string().required(),
    description: yup.string().required(),
    price: yup
        .number()
        .required()
        .test(
            "Is positive?",
            "ERROR: The number must be greater than 0!",
            (value) => {
                if(value){
                    return value  >= 0
                }
                return false
            }
        ),
});

//test