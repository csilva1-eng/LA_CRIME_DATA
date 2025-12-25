cmake_minimum_required(VERSION 3.16)
project(LA_CRIME_DATA LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17) # Set C++ standard
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(LA_CRIME_DATA crime.cpp tree.cpp)
target_link_libraries(LA_CRIME_DATA)