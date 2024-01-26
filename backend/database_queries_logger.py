from django.db import connection


class QueriesLogger:
    def __init__(self):
        self.show_time = False

    @property
    def last(self):
        return self[-1]

    def __getitem__(self, item):
        queries = self.queries[item]
        return queries

    @property
    def queries(self):
        return connection.queries if self.show_time else [i['sql'] for i in connection.queries]

    def __repr__(self):
        res = ''
        for i in self.queries:
            i = i.replace('"', '')
            res += i
            res += '\n'
        return res

    __str__ = __repr__

    def __len__(self):
        return len(self.queries)

    def clear(self):
        connection.queries_log.clear()


queries_logger = QueriesLogger()
