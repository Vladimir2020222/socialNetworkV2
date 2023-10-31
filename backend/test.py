# from random import random
# from tqdm import tqdm
#
#
# money = 1800
#
# start_bet = 2
#
#
# i = start_bet
# money_copy = money
# loses_need_to_lose_money = 0
#
# while True:
#     money_copy -= i
#     i *= 2
#     loses_need_to_lose_money += 1
#     if money_copy <= 0:
#         break
#
#
# print(loses_need_to_lose_money)
#
#
# def go():
#     random_calls = 0
#     while True:
#         line_of_not_success = 0
#         while True:
#             random_calls += 1
#             if random() > 0.5:
#                 line_of_not_success += 1
#             else:
#                 break
#         if line_of_not_success >= loses_need_to_lose_money:
#             return random_calls
#
#
# results = []
#
#
# for _ in tqdm(range(10000)):
#     results.append(go())
#
# print(results[:10])
# print('middle is', sum(results) / len(results))

