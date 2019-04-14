import nltk
import pandas as pd
from collections import defaultdict
import string
import os.path
import pickle
import numpy as np
import sys

"""
FOR KEYWORD GENERATION
"""
class TFIDF(object):
    # listings_file is path to SUMMARY listings.csv
    def __init__(self, review_file, listings_file):
        # download nltk packages if necessary
        nltk.download('stopwords')
        nltk.download('punkt')
        self.stopwords = nltk.corpus.stopwords.words('english')
        self.review_df = pd.read_csv(review_file)
        self.listing_df = pd.read_csv(listings_file)

        print(self.review_df.shape)
        if not os.path.isfile('idfs.pickle'):
            self.idfs()

        with open('idfs.pickle', 'rb') as f:
            self.idfs = pickle.load(f)

    def idfs(self):
        dfs = defaultdict(int)
        for review in self.review_df['comments']:
            # make sure review is valid
            if type(review) == str:
                # remove punctuation
                review_no_punc = review.translate(str.maketrans(dict.fromkeys(string.punctuation)))
                tokens = nltk.word_tokenize(review_no_punc)
                tokens = set([w for w in tokens if w not in self.stopwords])
                for w in tokens:
                    dfs[w] += 1

        n_docs = len(self.review_df['comments'])
        with open('idfs.pickle', 'wb') as f:
            pickle.dump({w: np.log(n_docs / df) for w, df in dfs.items()}, f)

    def get_keywords(self, listing_id):
        data = self.review_df
        listings = data.loc[data['listing_id'] == listing_id]

        tfs = defaultdict(int)
        for review in listings['comments']:
            if type(review) == str:
                review_no_punc = review.translate(str.maketrans(dict.fromkeys(string.punctuation)))
                tokens = nltk.word_tokenize(review_no_punc)
                tokens = [w for w in tokens if w not in self.stopwords]
                for w in tokens:
                    tfs[w] += 1

        tf_idfs = [(w, tf * self.idfs[w]) for w, tf in tfs.items()]

        # don't give host name as keyword
        l_df = self.listing_df
        host_name = str(l_df.loc[l_df['id'] == listing_id]['host_name'])
        tf_idfs = list(filter(lambda x: host_name not in x[0], tf_idfs))

        tf_idfs = sorted(tf_idfs, key=lambda x: x[1], reverse=True)[:20]

        return [x[0] for x in tf_idfs]

    def gen_keyword_dict(self):
        id_keywords = defaultdict(list)
        for listing_id in self.listing_df['id']:
            id_keywords[listing_id] += self.get_keywords(listing_id)

        with open('id_keywords.pickle', 'wb') as f:
            pickle.dump(id_keywords, f)

        return id_keywords

"""
END KEYWORD GENERATION
"""

# input: list of listing ids and list of keywords
# output: ids sorted based on similarity to keyword query
def rank_listings(listings, query):
    with open('id_keywords.pickle', 'rb') as f:
        id_keywords = pickle.load(f)

    query = set(query)
    sims = []
    for l in listings:
        keywords = set(id_keywords[l])
        # for now, number of keywords in common between query and listing
        sims.append((l, len(keywords.intersection(query))))

    sims = sorted(sims, key=lambda x: x[1], reverse=True)
    return [x[0] for x in sims][:100]



if __name__ == '__main__':
    d = sys.argv[1]
    d = json.loads(d)
    date_range, duration = d["dates"], d["duration"]
    neighborhood, keywords = d["neighborhood"], d["keywords"]

    import daterank

    calendar_dict = pickle.load(open("optimized_calendar_data.pickle", "rb" ))
	neighborhood_dict = pickle.load(open("calendar_with_neighborhood.pickle", "rb"))

	listings = daterank.applicable_listings(neighborhood_dict, neighborhood)
    # rank + restrict by keywords
    listings = rank_listings(listings, keywords)

	start_date = datetime.datetime.strptime(date_range[0][:10], "%Y-%m-%d")
	end_date = datetime.datetime.strptime(date_range[1][:10], "%Y-%m-%d")

	_, min_ratio, dict_ratio, best_start_date, best_end_date = daterank.average_ratio(listings, calendar_dict, start_date, end_date, 4)
	listings = dict_ratio[min_ratio]

    res = {"start_date": str(best_start_date)[:10], "end_date": str(best_end_date)[:10], "listings": listings}
    sys.stdout.flush()
