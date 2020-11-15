import redis
r = redis.Redis(host="18.222.232.8", port=6379, db=0)
print(str(r.lrange("casos", 0, -1)))