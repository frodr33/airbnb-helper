import nltk
# import pandas as pd
from collections import defaultdict
import string
import os.path
import pickle
import numpy as np
import sys
import json
import contextlib
import io

"""
FOR KEYWORD GENERATION
"""
class TFIDF(object):
    # listings_file is path to SUMMARY listings.csv
    def __init__(self, review_file, listings_file):
        # download nltk packages if necessary
        self.stopwords = nltk.corpus.stopwords.words('english')
        self.review_df = pd.read_csv(review_file)
        self.listing_df = pd.read_csv(listings_file)

        print(self.review_df.shape)
        if not os.path.isfile('./machine-learning/idfs.pickle'):
            self.idfs()

        with open('./machine-learning/idfs.pickle', 'rb') as f:
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
        with open('./machine-learning/idfs.pickle', 'wb') as f:
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

        with open('./machine-learning/id_keywords.pickle', 'wb') as f:
            pickle.dump(id_keywords, f)

        return id_keywords

class SVD(object):
    def __init__(self, review_file, listings_file):
        self.review_df = pd.read_csv(review_file)
        self.listing_df = pd.read_csv(listings_file)

        self.words_comp, self.reviews_comp, self.index_to_word = self.svd()

    def svd(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from scipy.sparse.linalg import svds
        import matplotlib.pyplot as plt
        from sklearn.preprocessing import normalize

        vectorizer = TfidfVectorizer(stop_words='english', max_df=.7, min_df=75)
        mat = vectorizer.fit_transform([r for r in self.review_df['comments'] if type(r) == str]).transpose()
        print(mat.shape)

        words_comp, _, reviews_comp = svds(mat, k=40)
        reviews_comp = reviews_comp.transpose()

        word_to_index = vectorizer.vocabulary_
        index_to_word = {i:t for t,i in word_to_index.items()}

        words_comp = normalize(words_comp, axis=1)
        reviews_comp = normalize(reviews_comp, axis=1)

        return words_comp, reviews_comp, index_to_word

    def gen_keyword_dict(self):
        id_keywords = {}
        reviews = self.review_df
        reviews = reviews.loc[reviews['comments'].notnull()].reset_index()
        for listing_id in self.listing_df['id']:
            listing_idxs = reviews.loc[reviews['listing_id'] == listing_id].index
            if len(listing_idxs) > 0:
                listing_vec = np.average(self.reviews_comp[listing_idxs], axis=0)

                sims = self.words_comp.dot(listing_vec)
                asort = np.argsort(-sims)[:11]

                id_keywords[listing_id] = [self.index_to_word[i] for i in asort[1:]]
            else:
                id_keywords[listing_id] = []

        with open('id_keywords_svd.pickle', 'wb') as f:
            pickle.dump(id_keywords, f)


"""
END KEYWORD GENERATION
"""

# builds map of listings to information
def build_listing_info(listings_file):
    with open(listings_file, 'rb') as f:
        listing_df = pd.read_csv(f)

    id_info = {}
    for row in listing_df.itertuples():
        id_info[row.id] = {"id": row.id, "name": row.name, "host_name": row.host_name,\
            "price": row.price, "location": {"latitude": row.latitude, "longitude": row.longitude}}

    with open('id_info.pickle', 'wb') as f:
        pickle.dump(id_info, f)

# input: list of listing ids and list of keywords
# output: ids sorted based on similarity to keyword query
def rank_listings(listings, query, testing=False):
    if testing:
        with open('./id_keywords_svd.pickle', 'rb') as f:
            id_keywords = pickle.load(f)
    else:
        with open('./machine-learning/id_keywords_svd.pickle', 'rb') as f:
            id_keywords = pickle.load(f)

    query = set(query)
    sims = []
    for l in listings:
        keywords = set(id_keywords[l])
        # for now, number of keywords in common between query and listing
        keys = keywords.intersection(query)
        sims.append((l, len(keys), list(keys)))

    sims = sorted(sims, key=lambda x: x[1], reverse=True)[:10]
    return [x[0] for x in sims], [x[2] for x in sims]


@contextlib.contextmanager
def nostdout():
    new_target = open(os.devnull, "w")
    old_target = sys.stdout
    sys.stdout = new_target
    try:
        yield new_target
    finally:
        sys.stdout = old_target

if __name__ == '__main__':
    try:
        with nostdout():
            nltk.download('punkt')
            nltk.download('stopwords')
            
        testing = False
        if testing:
            d = {"destination":"nyc","maxPrice":194,"dates":["2019-04-12T03:42:22.217Z","2019-05-21T03:42:22.217Z"],"numberAdults":3,"duration":4,"neighborhood":"Hell's Kitchen",\
                "bio":"I like big clean rooms with a pool."}
        else:
            d = sys.argv[1]
            d = json.loads(d)

        testing = False
        if testing:
            d = {"destination":"nyc","maxPrice":194,"dates":["2019-04-12T03:42:22.217Z","2019-05-21T03:42:22.217Z"],"numberAdults":3,"duration":4,"neighborhood":"Hell's Kitchen",\
                "bio":"I like big clean rooms with a pool."}
        else:
            d = sys.argv[1]
            d = json.loads(d)

        date_range, duration = d["dates"], d["duration"]
        neighborhood = d["neighborhood"]
        keywords = nltk.word_tokenize(d["bio"])
        # nltk.download('stopwords')
        keywords = [w for w in keywords if w not in nltk.corpus.stopwords.words('english')]


        import daterank

        if testing:
            neighborhood_dict = pickle.load(open("./calendar_with_neighborhood.pickle", "rb"))
        else:
            neighborhood_dict = pickle.load(open("./machine-learning/calendar_with_neighborhood.pickle", "rb"))

        listings = daterank.applicable_listings(neighborhood_dict, neighborhood)

        # rank + restrict by keywords
        listings, keys = rank_listings(listings, keywords, testing)

        if testing:
            with open('./id_info.pickle', 'rb') as f:
                id_info = pickle.load(f)
        else:
            with open('./machine-learning/id_info.pickle', 'rb') as f:
                id_info = pickle.load(f)

        listings_infos = []
        for i, listingID in enumerate(listings[:5]):
            if listingID in id_info:
                info = id_info[listingID]
                info['keywords'] = keys[i]
                listings_infos.append(id_info[listingID])
            else:
                print("key error:" + listingID)

        res = json.dumps({"start_date": "", "end_date": "", "listings": listings_infos})
        print(res)
    except Exception as e:
        print(e)

    sys.stdout.flush()
