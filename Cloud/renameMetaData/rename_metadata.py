import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs


def rename_metadata(event, contenxt):
    try:
        dynamodb = boto3.resource('dynamodb')

        table = dynamodb.Table('meta-data')

        body = json.loads(event['body'])
        print(body)
        email = body["email"]

        oldPath = body['oldPath']
        newPath = body['newPath']
        fileParams = body['fileParams']
        type = fileParams['type']
        size = fileParams['size']
        lastModified = fileParams['lastModified']
        description = fileParams['description']
        tags = fileParams['tags']
        #<-- dodaj tags -->
        table.put_item(
            Item={
                'emailAndName': newPath,
                'type': type,
                'size': size,
                'lastModified': lastModified,
                'description': description,
                'tags': tags
            })
        
        table.delete_item(
            Key = {
                'emailAndName' : oldPath
            }
        )

    # # return a properly formatted JSON object

        
        return create_response(200, {"email":email, "message":oldPath + " moved to " + newPath, "subject": "File edit"})
    
    except Exception as e:
        print(e)
        raise Exception({"oldPath": body["oldPath"], "newPath":body["newPath"]})
