const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    problemId:{
        type:String,
        required:true
    },
    problemName:{
        type:String,
        required:true
    },
    verdict:{
        type:[String],
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    time:{
        type:String,
        requied:true
    }
});

module.exports = mongoose.model('Submissions', submissionSchema);