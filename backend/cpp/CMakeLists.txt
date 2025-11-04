cmake_minimum_required(VERSION 3.16)
project(P2-DSA-LACrimeData LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17) # Set C++ standard
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(P2-DSA-LACrimeData crime.cpp tree.cpp)
target_link_libraries(P2-DSA-LACrimeData)