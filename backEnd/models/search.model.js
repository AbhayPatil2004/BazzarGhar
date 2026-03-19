import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  storeSearches: [
    {
      type: String,
    }
  ],
  productSearches: [
    {
      type: String,
    }
  ]
});


const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema)

export default SearchHistory ;