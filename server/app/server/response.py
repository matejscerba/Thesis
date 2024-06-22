from flask import Response


def stringify(data: str) -> Response:
    return Response(response=data)
