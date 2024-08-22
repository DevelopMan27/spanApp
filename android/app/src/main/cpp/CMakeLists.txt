cmake_minimum_required(VERSION 3.4.1)

add_library(
    MyNativeModule
    SHARED
    MyNativeModule.cpp
)

find_library(
    log-lib
    log
)

target_link_libraries(
    MyNativeModule
    ${log-lib}
)
