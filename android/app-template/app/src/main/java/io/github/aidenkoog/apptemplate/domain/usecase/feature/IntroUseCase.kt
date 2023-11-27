package io.github.aidenkoog.apptemplate.domain.usecase.feature

import dagger.hilt.android.scopes.ViewModelScoped
import io.github.aidenkoog.apptemplate.data.repository.IntroRepository
import io.github.aidenkoog.apptemplate.di.coroutine.IoDispatcher
import io.github.aidenkoog.apptemplate.domain.model.AppInfo
import io.github.aidenkoog.apptemplate.domain.model.Response
import io.github.aidenkoog.apptemplate.domain.usecase.base.CoroutineUseCase
import io.github.aidenkoog.apptemplate.domain.usecase.base.ResultUseCase
import kotlinx.coroutines.CoroutineDispatcher
import javax.inject.Inject

@ViewModelScoped
class GetAppInfoUseCase @Inject constructor(
    private val repository: IntroRepository,
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher,
)
/*) : CoroutineUseCase, ResultUseCase<Response<AppInfo>, Any>()*/ {

    /*override suspend fun invoke(params: Any) = invoke(ioDispatcher) {
        repository.getAppInfo("A", "")
    }*/
}