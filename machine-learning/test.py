import numpy as np
import sys
import json

try:
    data = sys.argv[1]
    d = json.loads(data)
    # print(d)
    date_range, duration = d["dates"], d["duration"]
# except:
    neighborhood, keywords = d["neighborhood"], d["keywords"]
# except:
    res = json.dumps({"start_date": "34", "end_date": "356", "listings":[]})
    print(res)
# except:
except Exception as e:
    print("EXCEPTION");
    print(e)

sys.stdout.flush()

