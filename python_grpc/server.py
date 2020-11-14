from concurrent import futures
from bson.json_util import dumps
import logging
import grpc
import helloworld_pb2
import helloworld_pb2_grpc
import json
import connecDB
import redis


r = redis.Redis(host="18.222.232.8", port=6379, db=0)

class Greeter(helloworld_pb2_grpc.GreeterServicer):
    def SayHello (self, request, context):
        print("request from: %s " % request.name)
        #insertar en la base de datos 
        data = json.loads(request.name)
        print(data)
        #insert to mongoDB
        try:
            status = connecDB.insertNote(data)
        except:
            pass

        #insert to redis
        try:        
            r.lpush("casos",dumps(data))
        except:       
            pass
        
        #print(str(r.lrange("casos", 0, -1)))
        return helloworld_pb2.HelloReply(message='Registro insertado.')


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
