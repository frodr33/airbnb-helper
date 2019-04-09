import nltk
import pandas as pd
from collections import defaultdict

class TFIDF(object):
    def __init__(self, review_file):
        self.stopwords = nltk.corpus.stopwords('english')
        self.review_df = pd.read_csv(review_file)
        self.idfs = self.idfs()

    def idfs(self):
        dfs = defaultdict(int)
        for review in self.review_df['comments']:
            review_no_punc = review.translate(None, string.punctuation)
            tokens = nltk.word_tokenize(review_no_punc)
            tokens = set([w for w in tokens if w not in self.stopwords])
            for w in tokens:
                dfs[w] += 1

        n_docs = len(self.review_data['comments'])
        return {w: np.log(n_docs / df) for w, df in dfs.items()}

    def get_keywords(listing_id):
        data = self.review_df
        listings = data.loc[data['listing_id'] == listing_id]

        tfs = defaultdict(int)
        for review in listings['comments']:
            review_no_punc = review.translate(None, string.punctuation)
            tokens = nltk.word_tokenize(review_no_punc)
            tokens = [w for w in tokens if w not in self.stopwords]
            for w in tokens:
                tfs[w] += 1

        tf_idfs = [(w, tf * self.idfs[w]) for w, tf in tfs.items()]
        tf_idfs = sorted(tf_idfs, key=lambda x: x[1], reverse=True)[:5]

        return [x[1] for x in tf_idfs]

if __name__ == '__main__':
    K = TFIDF('~/CS4300/reviews.csv')
    print(K.get_keywords('2595'))
