import json
import boto3
import json
from utility.utils import *

file_permission_table_name = "file-permissions"
user_table_name = "userTable"

dynamodb = boto3.resource('dynamodb')

file_permissions_table = dynamodb.Table(file_permission_table_name)
user_table = dynamodb.Table(user_table_name)


def remove_permission(event, context):
    body_message = {'message': ''}
    try:
        request_body = json.loads(event['body'])

        logged_user_email = get_logged_user_email(event)

        is_request_valid(request_body)
        is_user_exist(request_body)
        is_permission_exist(request_body, logged_user_email)
        remove_permission_from_table(request_body)
        return create_response(200, "Permission successfully removed.")

    except Exception as e:
        return create_response(400, str(e))


def is_request_valid(body_request):
    granted_user = body_request["granted_user"]
    file_path = body_request["file_path"]
    if not granted_user or not file_path:
        raise Exception("All fields are required!")


def is_permission_exist(body_request, logged_user_email):

    granted_user = body_request["granted_user"]
    file_path = body_request["file_path"]

    granted_user_permissions = query_table(table_name=file_permission_table_name,
                                           key="granted_user", value=granted_user)

    for granted_user_permission in granted_user_permissions:
        if granted_user_permission['file_path'] == file_path and granted_user_permission['granted_by_user'] == logged_user_email:
            return
    raise Exception(f"Permission doesn't exist!")


def remove_permission_from_table(body_request):
    file_permissions_table.delete_item(
        Key={
            "granted_user": body_request["granted_user"],
            "file_path": body_request["file_path"]
        }
    )


def is_user_exist(request_body):
    granted_user = request_body['granted_user']
    users = query_table(user_table_name, "email", granted_user)
    if len(users) == 0:
        raise Exception(f"User with email {granted_user} does not exist!")
