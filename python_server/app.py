import pika
import sys
import os
import json
import pymongo
import redis

myclient = pymongo.MongoClient("mongodb://18.191.247.101:27017")
mydb = myclient["proyecto2-g5"]
mycol = mydb["case"]
r = redis.Redis(host='18.222.232.8', port=6379, db=0)


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbit'))
    channel = connection.channel()

    channel.queue_declare(queue='hello')

    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)
        result = str(body).split("'")
        result = result[1]
        result = json.loads(result)
        r.lpush("casos", str(result))
        _ = mycol.insert_one(result)

    channel.basic_consume(
        queue='hello', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
