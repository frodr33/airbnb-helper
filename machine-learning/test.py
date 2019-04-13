import numpy as np
import sys
import json

try:
    data = sys.argv[1]
    d = json.loads(data)
    destination, max_price, date_range = d["destination"], d["maxPrice"], d["dates"]
    number_adults, neighborhood, keywords = d["numberAdults"], d["neighborhood"], d["keywords"]
    destination = [destination, max_price, date_range, number_adults, neighborhood, keywords]
except:
    destination = "EXCEPTION"

print(destination)
sys.stdout.flush()

