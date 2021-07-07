//This file exists simply to keep track of fields used by mongo models

//fields prefixed by . are unimplemented
//fields prefixed by > are optional

//IDEA SCHEMA
{
  _id: ObjectId,
  revisions: [
    {
      time: Datetime,
      title: String,
      description: String
    }
  ],
  creator: String, //the username of the creator
  >likes: [
    String //names of the people who have liked this idea
  ],
  >dislikes: [
    String // names of the users who have disliked this idea
  ],
  .comments: [
    {
      _id: ObjectId,
      user: String, //username of author
      comment: String, //contents of comment
      .timestamp: Date, //unimplemented, should be time when the comment was made
      replies: [
        //contains list of comments objects that are replies to the parent comment
      ]
    }
  ],
  private: Boolean,
  >delete_date: Datetime, //on the date specified, this idea will be removed from trash and deleted forever
  .tags: [ //list of tag names that each string contains
    String
  ],
  >builders: {
    //strings in lists are usernames, except for the object in built, which is defined by its keys
    existing: [
      {
        user: String,
        link: String
      }
    ],
    built: [
      {
        user: String,
        link: String
      }
    ],
    building: [
      String
    ],
    plan_to_build: [
      String
    ]
  }
}

//USER SCHEMA
{
  _id: ObjectId,
  email: String,
  username: String,
  password: String, // password hash
}
