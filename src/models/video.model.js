import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile:{
            type: String,
            required:true
        },
        thumbnail:{
            type: String,
            required:true
        },
        title:{
            type: String,
            required:true
        },
        description:{
            tyoe:String,
            required:true
        },
        duration:{  ///cloudinary
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        ispublished:{
            type:Boolean,
            default: true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)  ///this allow you to write aggregate queries

export const Video = mongoose.model("Video", videoSchema)